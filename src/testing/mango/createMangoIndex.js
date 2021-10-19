import createMangoMap from "./createMangoMap";


const createMangoIndex = (index, indexName, contextProps) => {
        let view = {[indexName]:{}};
        view[indexName].map = createMangoMap(index,indexName,contextProps);
        view[indexName].reduce = '_count';
        view[indexName].options = { def:index }
        return view;
}

export default createMangoIndex;