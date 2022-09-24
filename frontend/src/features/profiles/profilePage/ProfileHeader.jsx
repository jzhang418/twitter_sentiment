import { Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";

export default function ProfileHeaderPage({ profile, followings }) {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Header
                  as='h1'
                  style={{ display: "block", marginBottom: 10 }}
                  content={profile.displayName}
                />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group>
            <Statistic label='Following' value={followings} />
          </Statistic.Group>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
