import api from "./axios";


export const getClassroomsAPI = () => {
    return api.get("classrooms/");
}


