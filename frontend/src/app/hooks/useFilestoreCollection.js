import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionStart, asyncActionError, asyncActionFinish } from '../../features/accounts/accountSlice';
import { dataFromSnapshot } from "../firestore/firestoreService";

export default function useFirestoreCollection({query, data, deps}) {
    const dispath = useDispatch();

    useEffect(() => {
        dispath(asyncActionStart());
        const unsubscribe = query().onSnapshot(
            snapshot => {
                const docs = snapshot.docs.map(doc => dataFromSnapshot(doc));
                data(docs);
                dispath(asyncActionFinish());
            },
            error => dispath(asyncActionError(error))
        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}