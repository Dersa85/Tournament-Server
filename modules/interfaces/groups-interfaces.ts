

export interface Groups {
    [id: string]: Group;
}

export interface Group {
    groupName: string;
    title : string[];
    members: Member[];
}

export interface Member {
    values: string[];
}



// const groups: Groups = {
//     kinder: {
//         titles: ['alter'],
//         members: [
//             ['6'],
//             ['5']
//         ]
//     }
// }