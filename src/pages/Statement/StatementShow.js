import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import "./StatementShow.css";

import { Statement, User, Transaction } from "../../api";
import Calculator from "../../layout/Calculator/Calculator";
import { Spinner } from "../../components";
import {
  Container,
  Divider,
  Grid,
  Header,
  Menu,
  Message,
  Segment,
  Table,
  Statistic,
  Icon,
  Button,
  Modal,
  Form,
  Select
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const txn_options = [
  { key: "income", text: "Income", value: "INCOME" },
  { key: "savings", text: "Savings", value: "SAVINGS" },
  { key: "recurring", text: "Recurring", value: "RECURRING" },
  { key: "nonRecurring", text: "Non-Recurring", value: "NON-RECURRING" }
];

const category_options = [
  { key: "autoTransport", text: "Auto & Transport", value: "AUTO & TRANSPORT", name: "category" },
  { key: "billsUtilities", text: "Bills & Utilities", value: "BILLS & UTILITIES", name: "category" },
  { key: "charity", text: "Charity", value: "CHARITY", name: "category" },
  { key: "education", text: "Education", value: "EDUCATION", name: "category" },
  { key: "foodDrinks", text: "Food & Drinks", value: "FOOD & DRINKS", name: "category" },
  { key: "healthFitness", text: "Health & Fitness", value: "HEALTH & FITNESS", name: "category" },
  { key: "membershipsSubscriptions", text: "Memberships & Subscriptions", value: "MEMBERSHIPS & SUBSCRIPTIONS", name: "category" },
  { key: "personalCare", text: "Personal Care", value: "PERSONAL CARE", name: "category" },
  { key: "rent", text: "Rent", value: "RENT", name: "category" },
  { key: "shopping", text: "Shopping", value: "SHOPPING", name: "category" },
  { key: "travel", text: "Travel", value: "TRAVEL", name: "category" },
  { key: "miscellaneous", text: "Miscellaneous", value: "MISCELLANEOUS", name: "category" }
];

const StatementShow = props => {
  const [statement, setStatement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pieChart, setpieChart] = useState(null);
  const [formData, setFormData] = useState({
    transaction: {
      id: "",
      trans_date: "",
      trans_type: "",
      category: "",
      description: "",
      amount: ""
    }
  });
  const [errors, setErrors] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const [income, setIncome] = useState({create: false, edit: false});
  const [savings, setSavings] = useState({create: false, edit: false});
  const [recurringExpenses, setRecurringExpenses] = useState({create: false, edit: false});
  const [nonRecurringExpenses, setNonRecurringExpenses] = useState({create: false, edit: false});

  const [nonRecurringTransactions, setNonRecurringTransactions] = useState({
    trasnactions: [],
    total: 0
  });

  const dateOnChange = date => {
    setStartDate(date);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const { currentTarget: form } = event;
    const fd = new FormData(form);
    const newTransaction = {
      transaction: {
        trans_date: datePickerFormatter(fd.get("trans_date")),
        trans_type: fd.get("trans_type"),
        category: formData.transaction.category,
        description: fd.get("description"),
        amount: fd.get("amount")
      }
    };

    Transaction.create(props.match.params.id, newTransaction).then(response => {
      if (response.id) {
        setErrors("");
        setIncome({...savings, create: false});
        setSavings({...savings, create: false});
        setRecurringExpenses({...recurringExpenses, create: false});
        setNonRecurringExpenses({...nonRecurringExpenses, create: false});
        setFormData({
          transaction: {
            id: "",
            trans_date: "",
            trans_type: "",
            category: "",
            description: "",
            amount: ""
          }
        });
        Statement.one(props.match.params.id).then(statement => {
          setStatement(statement);
          setNonRecurringTransactions({
            transactions: statement.non_living_expense_transactions,
            total: statement.non_living_expense_total
          });
        });
      } else {
        setErrors("");
        setErrors(response.errors);
      }
    });
  };

  const handleEdit = event => {
    event.preventDefault();
    const { currentTarget: form } = event;
    const fd = new FormData(form);
    const editTransaction = {
      transaction: {
        id: parseInt(formData.transaction.id),
        trans_date: datePickerFormatter(fd.get("trans_date")),
        trans_type: fd.get("trans_type"),
        category: formData.transaction.category,
        description: fd.get("description"),
        amount: fd.get("amount")
      }
    };
    Transaction.update(props.match.params.id, editTransaction).then(
      response => {
        if (errors) {
          setErrors(response.errors);
        } else {
          setFormData({
            transaction: {
              id: "",
              trans_date: "",
              trans_type: "",
              category: "",
              description: "",
              amount: ""
            }
          });
          setIncome({...income, edit: false});
          setSavings({...savings, edit: false});
          setRecurringExpenses({...recurringExpenses, edit: false});
          setNonRecurringExpenses({...nonRecurringExpenses, edit: false});
          Statement.one(props.match.params.id).then(statement => {
            setStatement(statement);
            setNonRecurringTransactions({
              transactions: statement.non_living_expense_transactions,
              total: statement.non_living_expense_total
            });
          });
        }
      }
    );
  };

  const deleteTransaction = event => {
    event.preventDefault();
    Transaction.destroy(props.match.params.id, formData.transaction.id);
    Statement.one(props.match.params.id).then(statement => {
      setStatement(statement);
      setNonRecurringTransactions({
        transactions: statement.non_living_expense_transactions,
        total: statement.non_living_expense_total
      });
    });
    setIncome({...income, edit: false});
    setSavings({...savings, edit: false});
    setRecurringExpenses({...recurringExpenses, edit: false});
    setNonRecurringExpenses({...nonRecurringExpenses, edit: false});
    setFormData({
      transaction: {
        id: "",
        trans_date: "",
        trans_type: "",
        category: "",
        description: "",
        amount: ""
      }
    });
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

  const handleCategory = event => {
    event.preventDefault();
    const transactionList = statement.non_living_expense_transactions.filter(
      nle => nle.category === `${event.currentTarget.id}`
    );
    let sum = 0;
    transactionList.forEach(transaction => {
      sum += parseFloat(transaction.amount);
    });
    if (event.target.id) {
      setNonRecurringTransactions({
        transactions: transactionList,
        total: sum
      });
    } else {
      setNonRecurringTransactions({
        transactions: statement.non_living_expense_transactions,
        total: statement.non_living_expense_total
      });
    }
  };

  const createOpen = () => setIncome({...income, create: true});
  const createClose = () => setIncome({...income, create: false});

  const createOpen2 = () => setSavings({...savings, create: true});
  const createClose2 = () => setSavings({...savings, create: false});

  const createOpen3 = () => setRecurringExpenses({...recurringExpenses, create: true});
  const createClose3 = () => setRecurringExpenses({...recurringExpenses, create: false});

  const createOpen4 = () => setNonRecurringExpenses({...nonRecurringExpenses, create: true});
  const createClose4 = () => setNonRecurringExpenses({...nonRecurringExpenses, create: false});

  const editOpen = data => {
    setIncome({...income, edit: true});
    setFormData({
      transaction: {
        id: data.id,
        trans_date: data.trans_date,
        trans_type: data.trans_type,
        category: data.category,
        description: data.description,
        amount: data.amount
      }
    });
    const defaultArray = data.trans_date.split("T");
    const defaultDate = defaultArray[0].split("-");
    const defaultYear = parseInt(defaultDate[0]);
    const defaultMonth = parseInt(defaultDate[1] - 1);
    const defaultDay = parseInt(defaultDate[2]);
    if (defaultMonth === 0) {
      setStartDate(new Date(defaultYear, 11, defaultDay));
    } else {
      setStartDate(new Date(defaultYear, defaultMonth, defaultDay));
    }
  };
  const editClose = () => setIncome({...income, edit: false});
  const editOpen2 = () => setSavings({...savings, edit: true});
  const editClose2 = () => setSavings({...savings, edit: false});
  const editOpen3 = () => setRecurringExpenses({...recurringExpenses, edit: true});
  const editClose3 = () => setRecurringExpenses({...recurringExpenses, edit: false});
  const editOpen4 = () => setNonRecurringExpenses({...nonRecurringExpenses, edit: true});
  const editClose4 = () => setNonRecurringExpenses({...nonRecurringExpenses, edit: false});

  const formatDate = input => {
    const dateArray = input.split("T");
    const date = dateArray[0].split("-");
    const year = date[0];
    const month = date[1];
    const day = date[2];

    return month + "/" + day + "/" + year;
  };

  const handleDropdown = (event, data) => {
    setFormData({
      transaction: {
        ...formData.transaction,
        category: data.value
      }
    });
  };

  const formatAmount = input => {
    return "$" + parseFloat(input).toFixed(2);
  };

  useEffect(() => {
    Statement.one(props.match.params.id).then(statement => {
      setStatement(statement);
      setpieChart({
        labels: ["Auto & Transport", "Bills & Utilities", "Charity", 
                "Education", "Food & Drinks", "Health & Fitness", 
                "Memberships & Subscriptions", "Personal Care",
                "Rent", "Shopping", "Travel", "Miscellaneous"],
        datasets: [
          {
            label: "Non-Recurring Expenses",
            backgroundColor: ["#C9DE00", "#2FDE00", "#00A6B4", "#6800B4"],
            hoverBackgroundColor: ["#4B5000", "#175000", "#003350", "#35014F"],
            data: [
              statement.category_drink,
              statement.category_food,
              statement.category_want,
              statement.category_others
            ]
          }
        ]
      });
      setNonRecurringTransactions({
        transactions: statement.non_living_expense_transactions,
        total: statement.non_living_expense_total
      });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Spinner message="Preparing statement..." />;
  }
  return (
    <>
      <Modal
        as={Form}
        onSubmit={handleSubmit}
        open={income.create}
        onClose={createClose}
        size="tiny"
        closeIcon
        id="incomeCreate"
      >
        <Modal.Content>
          <Header as="h2" className="incomeHeader income">
            Income Transaction
          </Header>
          <Segment className="modal__box">
            {errors && (
              <div className="ui negative message">
                <div className="header modal__header">There was a problem</div>
                <div className="modal__header">{errors}</div>
              </div>
            )}
            <label>
              <strong>Transaction Date</strong>
            </label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={dateOnChange}
              name="trans_date"
            />
            <Form.Input
              type="text"
              label="Transaction Type"
              value="Income"
              name="trans_type"
            />
            <Form.Input
              type="text"
              label="Description"
              placeholder="What was it for?"
              name="description"
            />
            <Form.Input
              type="text"
              label="Amount"
              placeholder="$0.00"
              name="amount"
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            type="submit"
            color="black"
            icon="pencil alternate"
            content="Create"
          />
        </Modal.Actions>
      </Modal>

      <Modal
        as={Form}
        onSubmit={handleSubmit}
        open={savings.create}
        onClose={createClose2}
        size="tiny"
        closeIcon
      >
        <Modal.Content>
          <Header as="h2" className="incomeHeader savings">
            Savings Transaction
          </Header>
          <Segment className="modal__box">
            {errors && (
              <div className="ui negative message">
                <div className="header modal__header">There was a problem</div>
                <div className="modal__header">{errors}</div>
              </div>
            )}
            <label>
              <strong>Transaction Date</strong>
            </label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={dateOnChange}
              name="trans_date"
            />
            <Form.Input
              type="text"
              label="Transaction Type"
              value="SAVINGS"
              name="trans_type"
            />
            <Form.Input
              type="text"
              label="Description"
              placeholder="What was it for?"
              name="description"
            />
            <Form.Input
              type="text"
              label="Amount"
              placeholder="$0.00"
              name="amount"
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            type="submit"
            color="black"
            icon="pencil alternate"
            content="Create"
          />
        </Modal.Actions>
      </Modal>

      <Modal
        as={Form}
        onSubmit={handleSubmit}
        open={recurringExpenses.create}
        onClose={createClose3}
        size="tiny"
        closeIcon
        id="incomeCreate"
      >
        <Modal.Content>
          <Header as="h2" className="incomeHeader living_expense">
            Recurring Transactions
          </Header>
          <Segment className="modal__box">
            {errors && (
              <div className="ui negative message">
                <div className="header modal__header">There was a problem</div>
                <div className="modal__header">{errors}</div>
              </div>
            )}
            <label>
              <strong>Transaction Date</strong>
            </label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={dateOnChange}
              name="trans_date"
            />
            <Form.Input
              type="text"
              label="Transaction Type"
              value="LE"
              name="trans_type"
            />
            <Form.Input
              type="text"
              label="Description"
              placeholder="What was it for?"
              name="description"
            />
            <Form.Input
              type="text"
              label="Amount"
              placeholder="$0.00"
              name="amount"
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            type="submit"
            color="black"
            icon="pencil alternate"
            content="Create"
          />
        </Modal.Actions>
      </Modal>

      <Modal
        as={Form}
        onSubmit={handleSubmit}
        open={nonRecurringExpenses.create}
        onClose={createClose4}
        size="tiny"
        closeIcon
        id="incomeCreate"
      >
        <Modal.Content>
          <Header as="h2" className="incomeHeader non_living_expense">
            Non-Recurring Transactions
          </Header>
          <Segment className="modal__box">
            {errors && (
              <div className="ui negative message">
                <div className="header modal__header">There was a problem</div>
                <div className="modal__header">{errors}</div>
              </div>
            )}
            <label>
              <strong>Transaction Date</strong>
            </label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={dateOnChange}
              name="trans_date"
            />
            <Form.Input
              type="text"
              label="Transaction Type"
              value="NLE"
              name="trans_type"
            />
            <Form.Select
              label="Category"
              name="category"
              options={category_options}
              value={formData.transaction.category}
              onChange={handleDropdown}
            />
            <Form.Input
              type="text"
              label="Description"
              placeholder="What was it for?"
              name="description"
            />
            <Form.Input
              type="text"
              label="Amount"
              placeholder="$0.00"
              name="amount"
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            type="submit"
            color="black"
            icon="pencil alternate"
            content="Create"
          />
        </Modal.Actions>
      </Modal>

      <Modal
        as={Form}
        onSubmit={handleEdit}
        open={income.edit}
        onClose={editClose}
        size="tiny"
        closeIcon
        id="incomeEdit"
      >
        <Modal.Content>
          <Header as="h2" className="incomeHeader modal_edit">
            Transaction Edit
          </Header>
          <Segment className="modal__box">
            {errors && (
              <div className="ui negative message">
                <div className="header modal__header">There was a problem</div>
                <div className="modal__header">{errors}</div>
              </div>
            )}
            <label>
              <strong>Transaction Date</strong>
            </label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={dateOnChange}
              name="trans_date"
            />
            <Form.Input
              type="text"
              label="Transaction Type"
              value={formData.transaction.trans_type}
              name="trans_type"
            />
            {formData.transaction.trans_type === "NLE" && (
              // <Form.Input type="text" label="Category" name="category" defaultValue={formData.transaction.category}/>
              <Form.Select
                label="Category"
                name="category"
                options={category_options}
                value={formData.transaction.category}
                onChange={handleDropdown}
              />
            )}
            <Form.Input
              type="text"
              label="Description"
              placeholder="What was it for?"
              name="description"
              defaultValue={formData.transaction.description}
            />
            <Form.Input
              type="text"
              label="Amount"
              placeholder="$0.00"
              name="amount"
              defaultValue={formData.transaction.amount}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            type="delete"
            color="black"
            icon="times"
            content="Delete"
            onClick={deleteTransaction}
          />
          <Button
            basic
            type="submit"
            color="black"
            icon="save"
            content="Save"
          />
        </Modal.Actions>
      </Modal>

      <Grid celled className="mainGrid">
        <Grid.Column width={12}>
          <Header size="huge" textAlign="center">
            {statement.title}
          </Header>
          <div className="printIcon">
            <Icon
              floated
              name="print"
              size="large"
              className="printIcon"
              onClick={() => window.print()}
            />
          </div>
          <Segment
            className="table__title income"
            attached="top"
            content="Income"
          />
          <Table celled selectable>
            <Table.Header>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <Table.Row onClick={createOpen} className="adding_item_row">
                <Table.Cell collapsing>
                  {/* <input
                  type="text"
                  className="date_input"
                  value={newIncomeData.trans_date}
                  onChange={(e) => setNewIncomeData({...newIncomeData, trans_date: e.currentTarget.value})}
                /> */}
                </Table.Cell>
                <Table.Cell>
                  {/* <input 
                    type="text" 
                    className="description_input"
                    value={newIncomeData.description}
                    onChange={(e) => setNewIncomeData({...newIncomeData, description: e.currentTarget.value})}
                  /> */}
                </Table.Cell>
                <Table.Cell textAlign="right" collapsing>
                  <Button type="submit" className="transaction__add">
                    <Icon name="add" className="transaction__add" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              {statement.income_transactions.map(income => (
                <Table.Row key={income.id} onClick={() => editOpen(income)}>
                  <Table.Cell collapsing>
                    {formatDate(income.trans_date)}
                  </Table.Cell>
                  <Table.Cell>{income.description}</Table.Cell>
                  <Table.Cell collapsing>
                    {formatAmount(income.amount)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="right">
                  <strong>Total</strong>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <strong>{formatAmount(statement.income_total)}</strong>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>

          <Divider section />

          <Segment
            className="table__title savings"
            attached="top"
            content="Savings"
          />
          <Table celled selectable>
            <Table.Header>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell collapsing>Amount</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <Table.Row onClick={createOpen2} className="adding_item_row">
                <Table.Cell collapsing></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell textAlign="right">
                  <Button type="submit" className="transaction__add">
                    <Icon name="add" className="transaction__add" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              {statement.savings_transactions.map(savings => (
                <Table.Row key={savings.id} onClick={() => editOpen(savings)}>
                  <Table.Cell collapsing>
                    {formatDate(savings.trans_date)}{" "}
                  </Table.Cell>
                  <Table.Cell>{savings.description}</Table.Cell>
                  <Table.Cell collapsing>
                    {formatAmount(savings.amount)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="right">
                  <strong>Total</strong>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <strong>{formatAmount(statement.savings_total)}</strong>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>

          <Divider section />

          <Segment
            className="table__title living_expense"
            attached="top"
            content="Recurring Expenses"
            onClick
          />
          <Table celled selectable>
            <Table.Header>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <Table.Row onClick={createOpen3} className="adding_item_row">
                <Table.Cell collapsing></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell textAlign="right">
                  <Button type="submit" className="transaction__add">
                    <Icon name="add" className="transaction__add" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              {statement.living_expense_transactions.map(le => (
                <Table.Row key={le.id} onClick={() => editOpen(le)}>
                  <Table.Cell collapsing>
                    {formatDate(le.trans_date)}{" "}
                  </Table.Cell>
                  <Table.Cell>{le.description}</Table.Cell>
                  <Table.Cell collapsing>{formatAmount(le.amount)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="right">
                  <strong>Total</strong>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <strong>
                    {formatAmount(statement.living_expense_total)}
                  </strong>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>

          <Divider section />

          <Segment
            className="table__title non_living_expense nle_hover"
            attached="top"
            content="Non-Recurring Expenses"
            onClick={e => handleCategory(e)}
          />
          <Segment className="nle_breakdown" attached="top">
            <div
              className="nle_hover"
              id="FOOD"
              onClick={e => handleCategory(e)}
            >
              <Icon id="FOOD" name="food" size="large" /> $
              {statement.category_food}
            </div>
            <div
              className="nle_hover"
              id="DRINK"
              onClick={e => handleCategory(e)}
            >
              <Icon id="DRINK" name="coffee" size="large" /> $
              {statement.category_drink}
            </div>
            <div
              className="nle_hover"
              id="WANT"
              onClick={e => handleCategory(e)}
            >
              <Icon id="WANT" name="record" size="large" /> $
              {statement.category_want}
            </div>
            <div
              className="nle_hover"
              id="OTHERS"
              onClick={e => handleCategory(e)}
            >
              <Icon id="OTHERS" name="question" size="large" /> $
              {statement.category_others}
            </div>
          </Segment>
          <Table celled selectable className="daily_expense_table">
            <Table.Header>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <Table.Row onClick={createOpen4} className="adding_item_row">
                <Table.Cell collapsing></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell textAlign="right">
                  <Button type="submit" className="transaction__add">
                    <Icon name="add" className="transaction__add" />
                  </Button>
                </Table.Cell>
              </Table.Row>
              {nonRecurringTransactions.transactions.map(nle => (
                <Table.Row key={nle.id} onClick={() => editOpen(nle)}>
                  <Table.Cell collapsing>
                    {formatDate(nle.trans_date)}{" "}
                  </Table.Cell>
                  <Table.Cell collapsing>{nle.category} </Table.Cell>
                  <Table.Cell>{nle.description}</Table.Cell>
                  <Table.Cell collapsing>{formatAmount(nle.amount)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell />
                <Table.HeaderCell textAlign="right">
                  <strong>Total</strong>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <strong>{formatAmount(nonRecurringTransactions.total)}</strong>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Column>
        <Grid.Column width={4} textAlign="center">
          <div className="sticky">
            <Segment className="dashboard__box budget">
              <div className="box__first">
                <Icon name="calculator" size="huge" />
              </div>
              <div className="box__last show__budget__box">
                Budget Left
                <h1>${statement.statement_total}</h1>
                USED{" "}
                {parseInt(
                  (statement.non_living_expense_total /
                    statement.budget_start) *
                    100
                )}
                % FROM ${statement.budget_start}
              </div>
            </Segment>
            <Calculator />
            <div className="align__memobutton">
              <div></div>
              <Segment className="memo_header" attached="top">
                MEMO
                <Icon name="edit outline" size="large" />
              </Segment>
            </div>
            <Segment className="statement_memo">{statement.memo}</Segment>
          </div>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default StatementShow;
