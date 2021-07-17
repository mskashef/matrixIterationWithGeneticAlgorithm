import PropTypes from 'prop-types';

const Choose = props => {
    const {selected, choices, onSelect} = props;
    return (
        <div>
            {choices.map(choice => <button className={}></button>)}
        </div>
    )
}

export default Choose;

Choose.propTypes = {
    choices: PropTypes.arrayOf(
        PropTypes.string
    ),
    selected: PropTypes.string,
    onSelect: PropTypes.func
}