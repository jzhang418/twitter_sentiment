import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { Header, Item, Segment } from "semantic-ui-react";
import { listenToAccountFromFirestore } from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { listenToAccounts } from "../accountSlice";

function AccountDetial() {
  const dispatch = useDispatch();
  const params = useParams();
  const account = useSelector(state => state.account.accounts.find(e => e.id === params.id));
  const { loading, error } = useSelector(state => state.account);

  useFirestoreDoc({
    query: () => listenToAccountFromFirestore(params.id),
    data: account => dispatch(listenToAccounts([account])),
    deps: [params.id, dispatch]
  })

  if (loading || (!account && !error)) return <LoadingComponent content='Loading account...' />

  if (error) return <Navigate to='/error' replace />

  return (
    <Segment.Group>
      <Segment>
        <Header content='Twitter Account Details' />
      </Segment>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src={account.photoURL} />
            <Item.Content>
              <Item.Header content={account.title} />
              <Item.Description>{account.description}</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment clearing>
        <div>{account.topic}</div>
      </Segment>
    </Segment.Group>
  );
}

export default AccountDetial;
