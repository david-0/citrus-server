/**
 * @Param T: DtoType
 * @Param U: DtoSubType
 */
export class ConverterUtil {
    public static updateObjRef<T, U, V, W>(t: T, w: W, creator: (id: number) => U, inputObjReader: (t: T) => V,
        inputIdReader: (u: V) => number, objSetter: (w: W, u: U) => void) {
        if (inputObjReader(t) !== undefined  //
            && inputObjReader(t) !== null //
            && inputIdReader(inputObjReader(t)) !== undefined //
            && inputIdReader(inputObjReader(t)) !== null) {
            objSetter(w, creator(inputIdReader(inputObjReader(t))));
        }
    }
}