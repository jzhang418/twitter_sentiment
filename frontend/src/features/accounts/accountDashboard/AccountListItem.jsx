import { Link } from "react-router-dom";
import { Button, Item, Label, Segment, Statistic } from "semantic-ui-react";
import { format } from "date-fns";

function AccountListItem({ account }) {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src={account.photoURL} />
            <Item.Content verticalAlign='middle'>
              <Item.Header content={account.username} />
              <Item.Description >Member since: {format(new Date(account.created_at), 'MMMM d, yyyy')}</Item.Description>
              <Label
                style={{ top: "-30px" }}
                ribbon='right'
                color={account.isBot ? 'red' : 'green'}
                content={account.isBot ? 'Bot' : 'Human'}
              />
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment clearing>
        <Statistic.Group widths='4' size="tiny">
          <Statistic
            label='Follower'
            value={formatter.format(account.followers)}
            style={{ marginRight: 21 }}
          />
          <Statistic
            label='Following'
            value={formatter.format(account.followings)}
            style={{ marginRight: 21 }}
          />
          <Statistic
            label='Tweet'
            value={formatter.format(account.tweets)}
            style={{ marginRight: 21 }}
          />
        </Statistic.Group>
        <Button
          as={Link}
          to={`/accounts/${account.id}`}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
}

export default AccountListItem;
