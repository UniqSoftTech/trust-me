import express from 'express'
import bodyParser from 'body-parser'
import { SignProtocolClient, SpMode, EvmChains, delegateSignAttestation, delegateSignSchema } from '@ethsign/sp-sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(bodyParser.json())

// Setup SignProtocolClient with your private key

import { privateKeyToAccount } from 'viem/accounts'

const privateKey = ''

// const account = privateKeyToAccount()

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey),
})
console.log('🚀 ~ client:', client)

// In-memory storage for job history
const jobStorage = {}

// Add job history route
app.post('/addJob', async (req, res) => {
  try {
    const { userId, job } = req.body

    if (!userId || !job) {
      return res.status(400).json({ error: 'Missing userId or job details' })
    }

    // Create job history if not exists
    if (!jobStorage[userId]) {
      jobStorage[userId] = {
        userId,
        jobs: [],
      }
    }

    // Save the job details locally without attestation
    jobStorage[userId].jobs.push({ ...job, attestation: null })

    res.status(200).json({ message: 'Job added successfully. Awaiting employer signature.', job })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})
// Sign a job and create an attestation
app.post('/signJob', async (req, res) => {
  try {
    const { userId, jobIndex } = req.body

    // if (!userId || jobIndex === undefined) {
    //   return res.status(400).json({ error: 'Missing userId or jobIndex' })
    // }

    // const userJobs = jobStorage[userId]
    // if (!userJobs || !userJobs.jobs[jobIndex]) {
    //   return res.status(404).json({ error: 'Job not found for the user' })
    // }

    // const jobToSign = userJobs.jobs[jobIndex]

    // Create the schema for the job
    // const schemaData = {
    //   name: 'JobHistorySchema',
    //   data: [
    //     { name: 'company', type: 'string' },
    //     { name: 'role', type: 'string' },
    //     { name: 'start_date', type: 'string' },
    //     { name: 'end_date', type: 'string' },
    //     { name: 'description', type: 'string' },
    //   ],
    // }

    // Create the schema (if necessary)
    // const createSchemaRes = await client.createSchema(schemaData)

    // Create attestation
    const createAttestationRes = await client.createAttestation({
      schemaId: '0x427', // use the created schemaId
      data: {
        name: 'uniqsoft',
      },
      indexingValue: 'uniqsoft',
    })

    // Save attestation details
    // jobStorage[userId].jobs[jobIndex].attestation = createAttestationRes.attestation

    res.status(200).json({
      message: 'Job signed and indexed successfully.',
      attestation: createAttestationRes.attestation,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Retrieve all jobs for a user
app.get('/getJobs/:userId', (req, res) => {
  const { userId } = req.params

  if (!jobStorage[userId]) {
    return res.status(404).json({ error: 'No job history found for this user' })
  }

  res.status(200).json(jobStorage[userId])
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
