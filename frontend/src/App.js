import './App.css';
import {useState} from "react";
import Slider from '@material-ui/core/Slider';
import axios from "axios";
import {Button, CircularProgress} from "@material-ui/core";

let dirs = {
    'R': [1, 0],
    'L': [-1, 0],
    'D': [0, 1],
    'U': [0, -1],
}
function App() {
    const [tableSize, setTableSize] = useState(5);
    const [topSize, setTopSize] = useState(200);
    const [mutationRate, setMutationRate] = useState(2);
    const [populationSize, setPopulationSize] = useState(1100);
    const [path, setPath] = useState('');
    const [loading, setLoading] = useState(false);
    const [gen, setGen] = useState('');
    const handleMatrixSizeChange = (e, val) => {
        setTableSize(val);
        setPath('')
    }
    const handleTopSizeChange = (e, val) => {
        setTopSize(val);
    }
    const handleMutationRateChange = (e, val) => {
        setMutationRate(val);
    }
    const handlePopulationSizeChange = (e, val) => {
        setPopulationSize(val);
    }
    const handleSolve = () => {
        setLoading(true);
        axios.get(`http://localhost:7000/findSolution?matrixSize=${tableSize}&topSize=${topSize}&mutationRate=${mutationRate}&populationSize=${populationSize === 100 ? 100 : populationSize - 100}`)
            .then(res => {
                setLoading(false)
                setPath(res.data.solution);
                setGen(res.data.generation);
            })
            .catch(err => {
                setLoading(false)
            })
    }

    return (
        <div className="App">
            <div className={'matrixContainer'}>
                <div className={'left'}>
                    <div className="matrix">
                        <table cellPadding={0} cellSpacing={0}>
                            {Array(tableSize).fill().map(() => (
                                <tr>
                                    {Array(tableSize).fill().map(() => (
                                        <td />
                                    ))}
                                </tr>
                            ))}
                        </table>
                        <div className="pathContainer">
                            <svg className="svg" key={path}>
                                <path
                                    id="lineAB"
                                    strokeLinecap={"round"}
                                    d={`M 20 ${tableSize * 40 - 20} ${path.split('').map(dir => (`l ${dirs[dir][0] * 40} ${dirs[dir][1] * 40}`)).join(' ')}`}
                                    stroke="red"
                                    strokeWidth={8}
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className={'genContainer'}>{gen !== '' && 'Generation: '}{gen}</div>
                </div>
            </div>
            <br />
            <div className='right'>
                <div className={'row'}>
                    <div style={{width: 200, textAlign: 'left'}}>Table Size:&nbsp;&nbsp;{tableSize}&nbsp;&nbsp;</div>
                    <Slider
                        min={2}
                        max={10}
                        style={{width: 300, zIndex: 1}}
                        value={tableSize}
                        onChange={handleMatrixSizeChange}
                        aria-labelledby="continuous-slider"
                    />
                </div>
                <div className={'row'}>
                    <div style={{width: 200, textAlign: 'left'}}>Top Size:&nbsp;&nbsp;{topSize}&nbsp;&nbsp;</div>
                    <Slider
                        min={20}
                        max={10000}
                        step={100}
                        style={{width: 300, zIndex: 1}}
                        value={topSize}
                        onChange={handleTopSizeChange}
                        aria-labelledby="continuous-slider"
                    />
                </div>
                <div className={'row'}>
                    <div style={{width: 200, textAlign: 'left'}}>Mutation Rate:&nbsp;&nbsp;{mutationRate}%&nbsp;&nbsp;</div>
                    <Slider
                        min={0}
                        max={30}
                        style={{width: 300, zIndex: 1}}
                        value={mutationRate}
                        onChange={handleMutationRateChange}
                        aria-labelledby="continuous-slider"
                    />
                </div>
                <div className={'row'}>
                    <div style={{width: 200, textAlign: 'left'}}>Population Size:&nbsp;&nbsp;{populationSize === 100 ? 100 : populationSize - 100}&nbsp;&nbsp;</div>
                    <Slider
                        min={100}
                        max={100000 + 100}
                        step={1000}
                        style={{width: 300, zIndex: 1}}
                        value={populationSize}
                        onChange={handlePopulationSizeChange}
                        aria-labelledby="continuous-slider"
                    />
                </div>
                <Button disabled={loading} variant="contained" color="primary" style={{width: '100%', marginTop: 20, height: 50}} onClick={handleSolve}>
                    {loading ? <CircularProgress /> : 'Find Solution'}
                </Button>
            </div>
        </div>
    );
}

export default App;
