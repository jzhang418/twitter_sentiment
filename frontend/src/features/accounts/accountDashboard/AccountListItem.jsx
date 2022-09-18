import { Link } from "react-router-dom";
import { Button, Item, Segment } from "semantic-ui-react";

function AccountListItem({ account }) {
  return (
    <Segment.Group>
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
        <Button
          as={Link} to={`/accounts/${account.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
}

export default AccountListItem;
