import { colorMap } from "./colorMap";
export function getBgColor(pokemonDetails) {
    let bgColor=[];
    pokemonDetails.types.forEach(type => {
        bgColor.push(colorMap[type.type.name]);
    })
    let gradientStyle;
    if(bgColor.length>1){
        gradientStyle = {
            background: `linear-gradient(${bgColor.join(', ')})`
        }
    }else{
        gradientStyle = {
            background: bgColor[0]
        }
    }
    return gradientStyle;
}

export function capitalizeFirstLetter(str) {
    if(!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}