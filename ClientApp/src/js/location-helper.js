import data from './location';

const getStates = () => data.reduce((x, y) => x.concat(y.state.name), []);

const getLGA = (state) => {
    //console.log(state);
    if(state){
        return data.filter(x => x.state.name.toLowerCase() === state.toLowerCase())[0]
        .state
            .locals
                .reduce((x, y) => x.concat(y.name), []);
    }
    return [];
}
    
            

export default{
    getStates,
    getLGA
}