import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import {
  Comment,
  Grid,
  Header,
  Icon,
  Item,
  Label,
  Segment,
} from "semantic-ui-react";
import Chart from "react-apexcharts";
import { format } from "date-fns";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { getTweets, updateSelectedDate } from "./accountDetailSlice";
import AccountDetailSidebar from "./AccountDetailSidebar";

function AccountDetial() {
  const dispatch = useDispatch();
  const params = useParams();
  const account = useSelector((state) =>
    state.account.accounts.find((e) => e.id === Number(params.id))
  );
  const { loading, tweets, sentiment, topics, selectedDate, error } =
    useSelector((state) => state.accountdetail);

  const series = sentiment.slice(0, 3);

  const donutOptions = {
    colors: ["#46BFBD", "#FDB45C", "#F7464A"],
    labels: ["Positive", "Neutral", "Negative"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
  };

  const gaugeOptions = {
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#333",
          startAngle: -90,
          endAngle: 90,
        },
        dataLabels: {
          name: {
            show: true,
          },
          value: {
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        colorStops: [
          [
            { offset: 0, color: "#F7464A" },
            { offset: 50, color: "#FDB45C" },
            { offset: 100, color: "#46BFBD" },
          ],
        ],
      },
    },
    stroke: {
      lineCap: "butt",
    },
    labels: ["Sentiment"],
  };

  useEffect(() => {
    // the persist date is a string so need to convert back to javascript Date object again
    // during page reload
    const date =
      typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;
    dispatch(
      getTweets({
        user_id: params.id,
        selected_date: date.toLocaleDateString(),
      })
    );
  }, [dispatch, params.id, selectedDate]);

  if (loading || (!tweets && !error))
    return <LoadingComponent content='Loading account...' />;

  if (error) return <Navigate to='/error' replace />;

  function handleDateSelected(date) {
    dispatch(
      getTweets({
        user_id: params.id,
        selected_date: date.toLocaleDateString(),
      })
    );
    dispatch(updateSelectedDate(date));
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment.Group>
          <Segment>
            <Item.Group>
              <Item>
                <Item.Image size='tiny' circular src={account.photoURL} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header
                    className='ui large'
                    content={account.username}
                  />
                  <Item.Description>
                    Member since:{" "}
                    {format(new Date(account.created_at), "MMMM d, yyyy")}
                  </Item.Description>
                  <Label
                    style={{ top: "-50px" }}
                    ribbon='right'
                    color={account.isBot ? "red" : "green"}
                    content={account.isBot ? "Bot" : "Human"}
                  />
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment
            textAlign='center'
            attached='top'
            inverted
            color='teal'
            style={{ border: "none" }}
          >
            <Header>Sentiment</Header>
          </Segment>

          <Segment attached>
            <Grid>
              <Grid.Column width={1} verticalAlign='middle'>
                <Icon name='twitter' size='big' color='teal' />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign='middle'>
                <p style={{ fontSize: "2em" }}>Total Tweets: {tweets.length}</p>
              </Grid.Column>
              <Grid.Column width={10}>
                {tweets.length !== 0 && <Chart
                  options={gaugeOptions}
                  series={[sentiment[3]]}
                  type='radialBar'
                />
}
              </Grid.Column>
            </Grid>
          </Segment>

          <Segment attached>
            <Grid>
              <Grid.Column width={1}>
                <Icon name='heartbeat' size='big' color='teal' />
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='smile' size='large' color='teal' />
                <span> {series[0]} </span>
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='meh' size='large' color='yellow' />
                <span> {series[1]} </span>
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='frown' size='large' color='red' />
                <span> {series[2]} </span>
              </Grid.Column>
              <Grid.Column width={9}>
                {tweets.length !== 0 && <Chart
                  options={donutOptions}
                  series={series}
                  type='donut'
                  width='100%'
                />}
              </Grid.Column>
            </Grid>
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment
            textAlign='center'
            attached='top'
            inverted
            color='teal'
            style={{ border: "none" }}
          >
            <Header>Topics</Header>
          </Segment>

          <Segment attached>
            <p style={{ fontSize: "1.2em" }}>{topics}</p>
          </Segment>
        </Segment.Group>

        <Segment.Group>
          <Segment
            textAlign='center'
            attached='top'
            inverted
            color='teal'
            style={{ border: "none" }}
          >
            <Header>Tweets</Header>
          </Segment>

          <Segment attached>
            <Comment.Group size='large'>
              {tweets.length ? (
                tweets.map((tweet) => (
                  <Comment key={tweet.id}>
                    <Comment.Avatar src={account.photoURL} />
                    <Comment.Content>
                      <Comment.Metadata>
                        <div>
                          {format(new Date(tweet.created_at), "MM-dd-yyyy h:mm a")}
                        </div>
                      </Comment.Metadata>
                      <Comment.Text>{tweet.text}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                ))
              ) : (
                <p>No tweets available</p>
              )}
            </Comment.Group>
          </Segment>
        </Segment.Group>
      </Grid.Column>

      <Grid.Column width={6}>
        <AccountDetailSidebar
          loading={loading}
          onDateSelected={handleDateSelected}
        />
      </Grid.Column>
    </Grid>
  );
}

export default AccountDetial;
