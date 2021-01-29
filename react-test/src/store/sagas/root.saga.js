import { countSaga } from "./count.saga";
import { numSaga } from "./num.saga";
export const rootSaga = [numSaga, countSaga];
