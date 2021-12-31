import { Groups } from "./interfaces/groups-interfaces";




const groups: Groups = {}

export const getGroups = () => groups;


export const createNewGroup = (groupName: string, group: any) => {
    if (groups[groupName] != undefined) {
        console.log('Group exist');
        return;
    }
    console.log('Create new group', groupName);
    
    groups[groupName] = group;
    console.log(groups);
    

}