export default function World() {
    return (
        <IDKitWidget
            action={"verification"}
            onError={(error) => console.log("onError: ", error)}
            onSuccess={(response) => console.log("onSuccess: ", response)}
            handleVerify={(proof) => console.log("proof", proof)}
            app_id={"app_qqdfae343242b3e3649c321321"}
            verification_level={VerificationLevel.Device}
        >
            {({ open }) => <button onClick={open}>Open IDKit</button>}
        </IDKitWidget>
    );
}
