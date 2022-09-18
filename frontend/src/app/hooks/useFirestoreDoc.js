import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionStart, asyncActionError, asyncActionFinish } from '../../features/accounts/accountSlice';
import { dataFromSnapshot } from "../firestore/firestoreService";

export default function useFirestoreDoc({query, data, deps}) {
    const dispath = useDispatch();

    useEffect(() => {
        dispath(asyncActionStart());
        const unsubscribe = query().onSnapshot(
            snapshot => {
                if (!snapshot.exists) {
                    dispath(asyncActionError({code: 'not-found', message: 'Could not find document'}));
                    return;
                }
                data(dataFromSnapshot(snapshot));
                dispath(asyncActionFinish());
            },
            error => dispath(asyncActionError(error))
        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}