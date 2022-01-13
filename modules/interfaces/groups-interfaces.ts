

export interface Groups {
    [id: string]: Group;
}

export interface Group {
    groupName: string;
    titles : string[];
    memberValuesArrays: string[][];
}

// export interface Member {
//     values: string[];
// }



// const groups: Groups = {
//     kinder: {
//         titles: ['alter'],
//         members: [
//             ['6'],
//             ['5']
//         ]
//     }
// }