export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderId = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1]?._id : users[0]?._id;
};