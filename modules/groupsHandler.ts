import { Group, Groups } from "./interfaces/groups-interfaces";

const customId = require("custom-id");




const groups: Groups = {}

export const getGroups = () => groups;


export const createNewGroup = ( group: Group) => {
    console.log('Create new group:', group);
    const newId = customId({})
    groups[newId] = group;
    console.log(groups);
}

export const editGroup = (id: string, group: Group) => {
    console.log('Edit Group id', id);
    groups[id] = group;
}

export const getGroup = (id: string) => {
    return groups[id] as Group;
}


