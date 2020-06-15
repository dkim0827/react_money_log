import "./HomeAfter.css";
// import React, { Component } from "react";
// import Chart from "chart.js";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Menu,
  Segment,
  Step,
  Table
} from "semantic-ui-react";
import { Bar, Doughnut, Chart } from "react-chartjs-2";
import { StatementAll } from "../index";

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { Statement, User } from "../../api";
import { Spinner } from "../../components";

Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || "Arial";
      var txt = centerConfig.text;
      var txt2 = centerConfig.text2;
      var color = centerConfig.color || "#000";
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      //Start with a base font of 30px
      ctx.font = "40px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = chart.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2.2;
      var centerX1 = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY2 = (chart.chartArea.top + chart.chartArea.bottom) / 1.7;
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
      ctx.fillText(txt2, centerX1, centerY2);
    }
  }
});

const style = {
  h1: {
    marginTop: "3em"
  },
  h2: {
    margin: "4em 0em 2em"
  },
  h3: {
    marginTop: "2em",
    padding: "2em 0em"
  },
  last: {
    marginBottom: "300px"
  }
};

export const HomeAfter = () => {
  // const [Statements, setStatements] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [statementIndex, setStatementIndex] = useState({
    statements: [],
    isLoading: true
  });
  const [chartData, setChartData] = useState([]);
  let history = useHistory();

  const { statements } = statementIndex;
  const currentStatement = statements[0];

  const handleMouseClick = event => {
    event.preventDefault();
    history.push(`/statements/${currentStatement.id}`);
  };

  useEffect(() => {
    Statement.all().then(statements => {
      setStatementIndex({ statements, isLoading: false });
      let barLabels = [];
      let statement_total = [];
      let income_total = [];
      let savings_total = [];
      let living_expense_total = [];
      let non_living_expense_total = [];
      let user_balance = [];

      statements.forEach(statement => {
        const shortenLabel =
          statement.title.substring(0, 3) +
          " " +
          statement.title.substring(
            statement.title.length - 4,
            statement.title.length
          );
        barLabels.push(shortenLabel);
        statement_total.push(statement.statement_total);
        income_total.push(statement.income_total);
        savings_total.push(statement.savings_total);
        living_expense_total.push(statement.living_expense_total);
        non_living_expense_total.push(statement.non_living_expense_total);
        user_balance.push(statement.balance_left_end_of_statement);
      });
      setChartData({
        labels: barLabels.slice(0, 12).reverse(),
        datasets: [
          {
            label: "Balance",
            backgroundColor: "#00b5ad",
            data: user_balance.slice(0, 12).reverse(),
            hidden: true
          },
          {
            label: "Budget",
            backgroundColor: "#ab47bc",
            data: statement_total.slice(0, 12).reverse()
          },
          {
            label: "Income",
            backgroundColor: "#66bb6a",
            data: income_total.slice(0, 12).reverse(),
            hidden: true
          },
          {
            label: "Savings",
            backgroundColor: "#26c6da",
            data: savings_total.slice(0, 12).reverse(),
            stack: "expense",
            hidden: true
          },
          {
            label: "Monthly Expenses",
            backgroundColor: "#ffa726",
            data: living_expense_total.slice(0, 12).reverse(),
            stack: "expense",
            hidden: true
          },
          {
            label: "Daily Expenses",
            backgroundColor: "#ef5350",
            data: non_living_expense_total.slice(0, 12).reverse(),
            stack: "expense",
            hidden: true
          }
        ]
      });
    });
  }, []);

  if (statementIndex.isLoading) {
    return <Spinner message="Preparing Dashboard. Please Wait..." />;
  }
  if (currentStatement == null) {
    return <StatementAll />;
  }
  return (
    <main>
      <Segment>
        <Header as="h1" textAlign="center">
          Current Statement (
          {currentStatement["title"] || "Cannot Find Current Statement"})
        </Header>
        <Grid columns={2} stackable>
          <Grid.Row columns={5}>
            <Grid.Column
              onClick={handleMouseClick}
              className="currentStatement__link"
            >
              <Segment className="dashboard__box budget">
                <div className="box__first">
                  <Icon name="calculator" size="huge" />
                </div>
                <div className="box__last">
                  Remaining Budget
                  <h1>
                    ${currentStatement["statement_total"] || (0).toFixed(2)}
                  </h1>
                  AVERAGE $
                  {parseInt(currentStatement["average_budget"]) ||
                    (0).toFixed(2)}{" "}
                  / month
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column
              onClick={handleMouseClick}
              className="currentStatement__link"
            >
              <Segment className="dashboard__box income">
                <div className="box__first">
                  <Icon name="money bill alternate outline" size="huge" />
                </div>
                <div className="box__last">
                  Income
                  <h1>${currentStatement["income_total"] || (0).toFixed(2)}</h1>
                  AVERAGE $
                  {parseInt(currentStatement["average_income"]) ||
                    (0).toFixed(2)}{" "}
                  / month
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column
              onClick={handleMouseClick}
              className="currentStatement__link"
            >
              <Segment className="dashboard__box savings">
                <div className="box__first">
                  <Icon name="chart line" size="huge" />
                </div>
                <div className="box__last">
                  Savings
                  <h1>
                    ${currentStatement["savings_total"] || (0).toFixed(2)}
                  </h1>
                  AVERAGE $
                  {parseInt(currentStatement["average_savings"]) ||
                    (0).toFixed(2)}{" "}
                  / month
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column
              onClick={handleMouseClick}
              className="currentStatement__link"
            >
              <Segment className="dashboard__box living_expense">
                <div className="box__first">
                  <Icon name="home" size="huge" />
                </div>
                <div className="box__last">
                  Monthly Expenses
                  <h1>
                    $
                    {currentStatement["living_expense_total"] || (0).toFixed(2)}
                  </h1>
                  AVERAGE $
                  {parseInt(currentStatement["average_le"]) || (0).toFixed(2)} /
                  month
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column
              onClick={handleMouseClick}
              className="currentStatement__link"
            >
              <Segment className="dashboard__box non_living_expense">
                <div className="box__first">
                  <Icon name="cart arrow down" size="huge" />
                </div>
                <div className="box__last">
                  Daily Expenses
                  <h1>
                    $
                    {currentStatement["non_living_expense_total"] ||
                      (0).toFixed(2)}
                  </h1>
                  AVERAGE ${" "}
                  {parseInt(currentStatement["average_nle"]) || (0).toFixed(2)}{" "}
                  / month
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width={11} className="barChart__order">
              <Segment className="bar__chart">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                      display: true,
                      text: "Summary",
                      fontSize: 20
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: {
                        fontSize: 20,
                        boxWidth: 20
                      }
                    },
                    tooltips: {
                      titleFontSize: 20,
                      bodyFontSize: 20,
                      callbacks: {
                        label: function(tooltipItem, data) {
                          return (
                            "$" +
                            Number(tooltipItem.yLabel)
                              .toFixed(2)
                              .replace(/./g, function(c, i, a) {
                                return i > 0 &&
                                  c !== "." &&
                                  (a.length - i) % 3 === 0
                                  ? "," + c
                                  : c;
                              })
                          );
                        }
                      }
                    },
                    scales: {
                      xAxes: [
                        {
                          ticks: {
                            fontSize: 15
                          }
                        }
                      ],
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                            fontSize: 15,
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                              return "$" + value;
                            }
                          }
                        }
                      ]
                    }
                  }}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={5} className="budget__usage">
              <Segment>
                <Doughnut
                  data={
                    currentStatement["statement_total"] >= 0
                      ? {
                          labels: ["Spent", "Remaining"],
                          datasets: [
                            {
                              data: [
                                parseFloat(
                                  currentStatement["non_living_expense_total"]
                                ).toFixed(2),
                                (
                                  currentStatement["budget_start"] -
                                  currentStatement["non_living_expense_total"]
                                ).toFixed(2)
                              ],
                              backgroundColor: ["#ab47bc", "#D0D0D0"]
                            }
                          ]
                        }
                      : {
                          labels: ["Used"],
                          datasets: [
                            {
                              data: [
                                currentStatement[
                                  "non_living_expense_total"
                                ].toFixed(2)
                              ],
                              backgroundColor: ["#ab47bc"]
                            }
                          ]
                        }
                  }
                  options={{
                    elements: {
                      center: {
                        text: "Budget Usage",
                        text2: `${parseInt(
                          (currentStatement["non_living_expense_total"] /
                            currentStatement["budget_start"]) *
                            100
                        )} %`
                      }
                    },
                    cutoutPercentage: 80,
                    legend: {
                      display: false
                    }
                  }}
                />
              </Segment>
              <Segment>
                <Segment className="dashboard__box balance">
                  <div className="box__first">
                    <Icon name="dollar sign" size="huge" />
                  </div>
                  <div className="box__last">
                    Previous Statement Balance
                    <h1>
                      $
                      {currentStatement["balance_left_start_of_statement"] ||
                        (0).toFixed(2)}
                    </h1>
                  </div>
                </Segment>
                <Segment className="dashboard__box balance">
                  <div className="box__first">
                    <Icon name="dollar sign" size="huge" />
                  </div>
                  <div className="box__last">
                    Current Statement Balance
                    <h1>
                      $
                      {currentStatement["balance_left_end_of_statement"] ||
                        (0).toFixed(2)}
                    </h1>
                  </div>
                </Segment>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </main>
  );
};

export default HomeAfter;
