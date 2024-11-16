const getAllUsers = async () => {
  return [{ id: 1, name: "John Doe" }];
};

const createUser = async (data: any) => {
  return { id: 2, name: data.name };
};

export default { getAllUsers, createUser };
