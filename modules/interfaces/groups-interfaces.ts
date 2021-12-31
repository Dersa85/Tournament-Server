

export interface Groups {
    [title: string]: Group;
}

export interface Group {
    titles : string[];
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