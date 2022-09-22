import { useState } from "react";
import { Button, Grid, GridColumn, Header, Icon, Tab } from "semantic-ui-react";
import ProfileForm from "./ProfileForm";

export default function ProfileContent({ profile }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated='left'
            icon='user'
            content={`About ${profile.username}`}
          />
          <Button
            onClick={() => setEditMode(!editMode)}
            floated='right'
            basic
            content={editMode ? "Cancel" : "Edit"}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileForm profile={ profile } />
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>
                <Grid style={{ fontSize: "1.2em" }}>
                  <Grid.Row>
                    <GridColumn width={1}>
                      <Icon name='mail' size='large' color='teal' />
                    </GridColumn>
                    <GridColumn width={3}>
                      <p>Email: </p>
                    </GridColumn>
                    <GridColumn width={1}>
                      <p>{profile.email || null}</p>
                    </GridColumn>
                  </Grid.Row>
                  <Grid.Row>
                    <GridColumn width={1}>
                      <Icon name='twitter' size='large' color='teal' />
                    </GridColumn>
                    <GridColumn width={3}>
                      <p>Twitter ID: </p>
                    </GridColumn>
                    <GridColumn width={1}>
                      <p>{profile.twitter_id || null}</p>
                    </GridColumn>
                  </Grid.Row>
                </Grid>
              </div>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}
