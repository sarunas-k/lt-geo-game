interface ILocation {
    name: string,
    x: number,
    y: number
}

interface IQuestion {
    textMain: string,
    textSecondary?: string,
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
