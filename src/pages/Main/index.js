import React, { Component } from 'react';
import { FaGithubAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import { List, PageActions } from './styles';

export default class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        since: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    users: [],
  };

  async componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    const response = await api.get(`/api/users`);

    this.setState({
      users: response.data,
      next: response.headers.next,
    });
  };

  loadNextUsers = async url => {
    const response = await api.get(url);

    this.setState({
      users: response.data,
      next: response.headers.next,
    });
  };

  render() {
    const { users, next } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Listagem de usuários
        </h1>

        <List>
          {users.map(user => (
            <li key={user.login}>
              <span>
                <b>{user.id}</b> - <span>{user.login}</span>
              </span>
              <Link to={`/user/${encodeURIComponent(user.login)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
        <PageActions>
          <button type="button" onClick={() => this.loadNextUsers(next)}>
            Próximo
          </button>
        </PageActions>
      </Container>
    );
  }
}
