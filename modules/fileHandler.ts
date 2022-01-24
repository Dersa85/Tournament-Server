import { writeFile, readFileSync, existsSync } from 'fs';


export const loadJson = (path: string): any => {
    if (existsSync(path)) {
        const data = readFileSync(path, 'utf8')
        console.log('Load groups:', JSON.parse(data));
        return JSON.parse(data);
    }
    return {};
}

export const saveJson = (path: string, data: any): void => {
    const dataString = JSON.stringify(data)
    writeFile(path, dataString, (err) => {
        if (err) {
            console.log('Saving File error:', err.message); 
        }
    })
    
}