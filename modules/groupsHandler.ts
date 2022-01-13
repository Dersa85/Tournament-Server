import { Groups } from "./interfaces/groups-interfaces";

const customId = require("custom-id");




const groups: Groups = {}

export const getGroups = () => groups;


export const createNewGroup = ( group: any) => {
    console.log('Create new group:', group);
    const newId = customId({})
    groups[newId] = group;
    console.log(groups);
}


