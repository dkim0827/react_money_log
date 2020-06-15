// import "./HomeAfter.css";
// import React, { Component } from "react";
// import Chart from "chart.js";
// import { Grid } from "semantic-ui-react";
// import classes from "./LineGraph.module.css";

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./StatementAll.css";

import { Statement, User } from "../../api";
import { Spinner } from "../../components";

import {
  Container,
  Segment,
  Header,
  Icon,
  Table,
  Grid,
  Input,
  Button
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const year_options = [
  { key: "2020", text: "2020", value: 2020 },
  { key: "2019", text: "2019", value: 2019 },
  { key: "2018", text: "2018", value: 2018 },
  { key: "2017", text: "2017", value: 2017 },
  { key: "2016", text: "2016", value: 2016 }
];

const month_options = [
  { key: "jan", text: "January", value: 1 },
  { key: "feb", text: "February", value: 2 },
  { key: "mar", text: "March", value: 3 },
  { key: "apr", text: "April", value: 4 },
  { key: "may", text: "May", value: 5 },
  { key: "jun", text: "June", value: 6 },
  { key: "jul", text: "July", value: 7 },
  { key: "aug", text: "August", value: 8 },
  { key: "sep", text: "September", value: 9 },
  { key: "oct", text: "October", value: 10 },
  { key: "nov", text: "November", value: 11 },
  { key: "dec", text: "December", value: 12 }
];

const HomeAfter = () => {
  // const [Statements, setStatements] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [statementIndex, setStatementIndex] = useState({
    statements: [],
    isLoading: true,
    keyword: ""
  });
  const [formData, setFormData] = useState({
    statement: {
      period: "",
      memo: ""
    }
  });
  const [errors, setErrors] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [incomeCreate, setIncomeCreate] = useState(false);
  const [incomeEdit, setIncomeEdit] = useState(false);

  let history = useHistory();

  const handleChange = e => {
    const notCaseSensitive = e.target.value.toLowerCase();
    setStatementIndex({ ...statementIndex, keyword: notCaseSensitive });
  };

  const filteredList = statementIndex.statements.filter(
    info => info.title.toLowerCase().indexOf(statementIndex.keyword) !== -1
  );

  const deleteStatement = id => {
    const newStatementsList = statementIndex.statements.filter(
      s => s.id !== id
    );
    // setStatements(newStatementsList);
    setStatementIndex({ ...statementIndex, statements: newStatementsList });
  };

  const formatPeriod = input => {
    const periodArray = input.split(", ");
    const monthAbbr = periodArray[0].slice(0, 3);
    return monthAbbr + "/" + periodArray[1];
  };

  const datePickerFormatter = input => {
    if (input) {
      const datePickerArray = input.split("/");
      const dPmonth = datePickerArray[0];
      const dPday = datePickerArray[1];
      const dPyear = datePickerArray[2];
      return dPyear + "-" + dPmonth + "-" + dPday;
    } else {
      return "";
    }
  };

  useEffect(() => {
    Statement.all().then(statements => {
      // setStatements(Statements);
      // setIsLoading(false);
      setStatementIndex({ ...statementIndex, statements, isLoading: false });
    });
  }, []);

  if (statementIndex.isLoading) {
    return <Spinner message="Wait to load the list of Statements" />;
  }
  return (
    <Container className="statementAll__template">
      <h1 className="statementAll__header">STATEMENTS</h1>
      <div className="statementAll_search">
        <Input
          icon="search"
          placeholder="Search..."
          onChange={handleChange}
          value={statementIndex.keyword}
        />
        <div className="printIcon">
          <Icon
            floated
            name="print"
            size="large"
            className="printIcon"
            onClick={() => window.print()}
          />
        </div>
      </div>
      <Segment className="table__title statementAll" attached="top" />
      <div className="statementAll_table_scroll">
        <Table celled selectable>
          <Table.Header>
            <Table.HeaderCell singleLine textAlign="center">
              Period
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Income
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Savings
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Monthly ( - )
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Daily ( - )
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Budget
            </Table.HeaderCell>
            <Table.HeaderCell singleLine textAlign="center">
              Balance
            </Table.HeaderCell>
          </Table.Header>

          <Table.Body className="tableBody__scroll">
            <Table.Row className="adding_item_row">
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell textAlign="right">
                <Button type="submit" className="transaction__add">
                  <Icon name="add" className="transaction__add" />
                </Button>
              </Table.Cell>
            </Table.Row>
            {filteredList.map(statement => (
              <Table.Row
                key={statement.id}
                onClick={() => history.push(`statements/${statement.id}`)}
              >
                {/* <Link to={`/statements/${statement.id}`}> */}
                <Table.Cell textAlign="center">
                  {statement.title}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.income_total}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.savings_total}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.living_expense_total}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.non_living_expense_total}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.statement_total}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  ${statement.balance_left_end_of_statement}
                </Table.Cell>
                {/* </Link> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default HomeAfter;

//   return (
//     <main>
//       <h2 className="ui horizontal divider header">Statements</h2>
//       <ul className="ui list">
// {statementIndex.statements.map(statement => (
//   <li className="item" key={statement.id}>
//     <Link
//       to={`/statements/${statement.id}`}
//       className="ui link title"
//       href=""
//     >
//               {statement.title}
//               <br />
//             </Link>
//             <p>
//               Period : {statement.period}
//               <br />
//               Memo : {statement.memo}
//               <br />
//               Start balance: ${statement.balance_left_start_of_statement}
//               <br />
//               Statement Total : ${statement.statement_total}
//               <br />
//               End balance : ${statement.balance_left_end_of_statement}
//               <br />
//               <br />
//               Income Total : ${statement.income_total}
//               <br />
//               <br />
//               LE Total : ${statement.living_expense_total}
//               <br />
//               <br />
//               NLE Total : ${statement.non_living_expense_total}
//               <br />
//               Drink : ${statement.category_drink}
//               <br />
//               Food : ${statement.category_food}
//               <br />
//               Want : ${statement.category_want}
//               <br />
//               Others : ${statement.category_others}
//               <br />
//             </p>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// };
