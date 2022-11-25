import './car_distribution.css'

function CarDistribution() {

    let positions = [10, 1000, 2000, 2060, 2120, 2500, 3000];

    const dotStyle = {
        left: "calc(" + positions[0]/3000.0*100 + "% - 5px)"
    }

    return(
        <div className="ContainerDiv">
            <h3 className='subtitle'>Disfunction analysis</h3>
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