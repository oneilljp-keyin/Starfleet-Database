import randomString from "random-string";
console.log("WTF");

let outerDiv = [];
for (let i = 3; i < 7; i++) {
    let innerDiv = [];
    for (let j = 1; j < 15; j++) {
        innerDiv.push(<div className={`dc${j}`} key={`${i}${j}`}>{randomString({ length: Math.floor(Math.random() * (4 - 2 + 1) + 2), letters: false })}</div>)
    }
    outerDiv.push(<div className={`row-${i}`} key={`4${i}`}>{innerDiv}</div>)
}

const DataCascade = () => {

    return (
        <div className="cascade-wrapper">
            <div className="data-cascade" >{outerDiv}</div>
        </div>
    )
}


export default DataCascade;