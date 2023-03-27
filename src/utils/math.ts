export const random = (min: number, max: number) => {
    let randomNum = Math.random() * (max - min) + min;
    return Math.floor(randomNum);
};
