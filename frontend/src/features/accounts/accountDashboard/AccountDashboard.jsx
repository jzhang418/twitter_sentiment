import { Grid } from "semantic-ui-react";
import AccountList from "./AccountList";
import { useDispatch, useSelector } from "react-redux";
import EventListItemPlaceholder from "./AccountListItemPlaceholder";
import { useEffect } from "react";
import { fetchAccounts } from "../accountSlice";

function AccountDashboard() {
    const dispatch = useDispatch();
    const {accounts, loading} = useSelector(state => state.account);

    useEffect(() => {
        dispatch(fetchAccounts())
    }, [dispatch])

    return (
        <Grid>
            <Grid.Column width={16}>
                {loading &&
                    <>
                    <EventListItemPlaceholder />
                    <EventListItemPlaceholder />
                    </>
                }
                <AccountList accounts={accounts} />
            </Grid.Column>
        </Grid>
    )
}

export default AccountDashboard;