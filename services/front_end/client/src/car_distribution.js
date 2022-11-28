import './car_distribution.css'
import { useEffect, useState } from 'react';

function CarDistribution() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [positions, setItems] = useState([]);

    useEffect(() => {
        fetch("http://160.85.253.79:30002/car-distribution")
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

    //let positions = [10, 1000, 2000, 2060, 2120, 2500, 3000];

    //const dotStyle = {
    //    left: "calc(" + positions[0]/3000.0*100 + "% - 5px)"
    //}

    return(
        <div className="ContainerDiv">
            <h3 className='subtitle'>Car distribution</h3>
            <div className="graph">
                {positions.map(el => {
                    return (<div className="Dot" style={{left: "calc(" + el/3000.0*100 + "% - 5px)"}}></div>)
                })}
            </div>
            <div style={{float:"left", color:"whitesmoke"}}>0m</div>
            <div style={{float:"right", color:"whitesmoke"}}>3000m</div>
        </div>
    )
}

export default CarDistribution;