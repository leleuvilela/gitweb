import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, ReposList, PageActions } from './styles';

export default class User extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        user: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    user: {},
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const userName = decodeURIComponent(match.params.user);

    const [user, repos] = await Promise.all([
      api.get(`api/users/${userName}/details`),
      api.get(`api/users/${userName}/repos`),
    ]);

    this.setState({
      user: user.data,
      repos: repos.data,
      next: repos.headers.next ? repos.headers.next : null,
      prev: repos.headers.prev ? repos.headers.prev : null,
      loading: false,
    });
  }

  loadRepos = async action => {
    const { next, prev } = this.state;

    const url = action === 'next' ? next : prev;

    console.log(url);

    const repos = await api.get(url);

    this.setState({
      repos: repos.data,
      next: repos.headers.next ? repos.headers.next : null,
      prev: repos.headers.prev ? repos.headers.prev : null,
    });
  };

  render() {
    const { user, loading, repos, prev, next } = this.state;

    const date = new Date(user.created_at);
    const createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos usuários</Link>
          <img src={user.avatar_url} alt={user.login} />
          <h1>{user.name}</h1>
          <a href={user.html_url}>Perfil no GitHub</a>
          <p>Criado em: {createdAt}</p>
          <p>Id: {user.id}</p>
        </Owner>

        <ReposList>
          {repos.map(repo => (
            <li key={String(repo.id)}>
              <div>
                <strong>
                  <a href={repo.html_url}>{repo.name}</a>
                </strong>
                <p>
                  {repo.id} - {repo.language}
                </p>
              </div>
            </li>
          ))}
        </ReposList>

        <PageActions>
          <button
            type="button"
            disabled={!prev}
            onClick={() => this.loadRepos('back')}
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => this.loadRepos('next')}
          >
            Próximo
          </button>
        </PageActions>
      </Container>
    );
  }
}
