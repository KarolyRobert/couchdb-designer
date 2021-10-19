import createMangoMapFunction from "./createMangoMapFunction";
import createMangoFilter from "./createMangoFilter";
import mangoFields from "../../util/mangoFields";
import path from 'path';





const createMangoMap = (index,indexName,contextProps) => {
    let file = path.join(contextProps.root,contextProps.name)
    let fields = mangoFields(index.fields,file,indexName);
    let partial_filter = createMangoFilter(index.partial_filter_selector,file,indexName);
    return createMangoMapFunction(fields,partial_filter,contextProps.contextId);
}

export default createMangoMap;