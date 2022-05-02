const fetchAllUsers = (req, res) => {
    res.send("Fetch all users");
}
const createUser = (req, res) => {
    res.send("Create user");
}
const fetchUserById = (req, res) => {
    res.send("Fetch user by id");
}


module.exports = {
    fetchAllUsers,
    createUser,
    fetchUserById
}