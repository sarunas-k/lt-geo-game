interface ILocation {
    name: string,
    district: IDistrict,
    x: number,
    y: number
}

interface IQuestion {
    text: string,
    location: ILocation
}

interface ICoordinates {
    x: number,
    y: number
}

interface IModalData {
    title: string,
    content?: string
}

interface IDistrict {
    name: string
}
