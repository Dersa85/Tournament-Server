import { Group, Groups } from "./interfaces/groups-interfaces";
import { join as pathCreator } from "path";
import { loadJson, saveJson } from "./fileHandler";
const customId = require("custom-id");

const groupsPath = pathCreator(__dirname, '..', 'data', 'groups.json'); //'./data/groups.json';
const groups: Groups = loadJson(groupsPath) as Groups;


export const getGroups = () => groups;

export const createNewGroup = ( group: Group) => {
    console.log('Create new group:', group);
    const newId = customId({})
    groups[newId] = group;
    saveJson(groupsPath, groups);
    console.log(groups);
}

export const editGroup = (id: string, group: Group) => {
    console.log('Edit Group id', id);
    groups[id] = group;
    saveJson(groupsPath, groups);
}

export const getGroup = (id: string) => {
    return groups[id] as Group;
}


