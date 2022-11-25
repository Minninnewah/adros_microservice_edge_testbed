import './speed_analysis.css';
import { useEffect, useState } from 'react';

function SpeedAnalysis() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://speed-analysis:5000")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])

    const ARRAY_LENGTH = 100;

    const scale = function (number, inMin, inMax, outMin, outMax) {
        return Math.round((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    }

    const scaleSpeedToColorR = function (speed) {
        return 255-scale(speed, 0, 130, 0, 255);
    }

    const scaleSpeedToColorG = function (speed) {
        return 51-scale(speed, 0, 130, 0, 51);
    }

    const scaleSpeedToColorB = function (speed) {
        return 102+153-scale(speed, 0, 130, 102, 153);
    }

    //let array = new Array(ARRAY_LENGTH).fill(120);
    //array[3] = 100;
    //array[4] = 80;
    //array[5] = 80;
    //array[6] = 80;
    //array[7] = 10;
    //array[8] = 30;

    

    

    const createGradientStyle = function () {
        let colorString = "";
        items.reverse().forEach((el, index) => {
            if(index != 0){
                colorString += ","
            }
            colorString += "rgb(" + scaleSpeedToColorR(el) + "," + scaleSpeedToColorG(el) + "," + scaleSpeedToColorB(el) + ")"
        })
        return {
            backgroundImage: "linear-gradient(to left," + colorString + ")"
        }
    }

    //const divStyle = {
    //    backgroundImage: "linear-gradient(to left," + colorString + ")"
    //}

    if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return(
            <div className="Container">
                <h3 className="subtitle" >Speed analysis</h3>
                <div className="SpeedAnalysisDiv" style={createGradientStyle()}/>;
                <div style={{float:"left", color:"whitesmoke"}}>0m</div>
                <div style={{float:"right", color:"whitesmoke"}}>3000m</div>
            </div>
        )
        }
}

export default SpeedAnalysis;