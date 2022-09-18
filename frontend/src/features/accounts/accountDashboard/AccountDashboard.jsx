import { Grid } from "semantic-ui-react";
import AccountList from "./AccountList";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import EventListItemPlaceholder from "./AccountListItemPlaceholder";
import { listenToAccountsFromFirestore } from "../../../app/firestore/firestoreService";
import { listenToAccounts } from "../accountSlice";
import useFirestoreCollection from "../../../app/hooks/useFilestoreCollection";

function AccountDashboard() {
    const dispatch = useDispatch();
    const {accounts, loading} = useSelector(state => state.account);

    useFirestoreCollection({
        query: () => listenToAccountsFromFirestore(),
        data: accounts => dispatch(listenToAccounts(accounts)),
        deps: [dispatch]
    })

    return (
        <Grid>
            <Grid.Column width={10}>
                {loading &&
                    <>
                    <EventListItemPlaceholder />
                    <EventListItemPlaceholder />
                    </>
                }
                <AccountList accounts={accounts} />
            </Grid.Column>
            <Grid.Column width={6}>
                <SideBar />
            </Grid.Column>
        </Grid>
    )
}

export default AccountDashboard;