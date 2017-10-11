// @flow

export type Account = {
  username: string,
}

export type App = {
  is_disabled: boolean,
  project_type: string,
  provider: string,
  repo_owner: string,
  repo_slug: string,
  repo_url: string,
  slug: string,
  title: string,
}

export type Build = {
  abort_reason: string,
  branch: string,
  build_number: number,
  commit_hash: ?string,
  commit_message: ?string,
  commit_view_url: ?string,
  environment_prepare_finished_at: string,
  finished_at: string,
  is_on_hold: Boolean,
  original_build_params: {
    branch: string,
    workflow_id: string
  },
  pull_request_id: number,
  pull_request_target_branch: ?string,
  pull_request_view_url: ?string,
  slug: string,
  stack_config_type: string,
  stack_identifier: string,
  started_on_worker_at: string,
  status: number,
  status_text: string,
  tag: ?string,
  triggered_at: string,
  triggered_by: string,
  triggered_workflow: string,
}

export type Paging = {
  next: string,
  page_item_limit: number,
  total_item_count: number,
}

export default class BitriseClient {

  url: string
  token: string

  constructor(url: string = 'https://api.bitrise.io/v0.1') {
    this.url = url
  }

  setToken(token: string) {
    this.token = token
  }

  request(path: string): Promise<any> {
    return fetch(`${this.url}/${path}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    }).then((response) => {
      return response.json()
    })
  }

  account(): Promise<Account> {
    return this.request('me').then((response: { data: Account }) => response.data)
  }

  apps(): Promise<Array<App>> {
    return this.request('me/apps').then((response: { data: Array<App>, paging: Paging }) => response.data)
  }

  builds(app: string): Promise<Array<Build>> {
    return this.request(`apps/${app}/builds`).then((response: { data: Array<Build>, paging: Paging }) => response.data)
  }

  build(app: string, build: string): Promise<Build> {
    return this.request(`apps/${app}/builds/${build}`).then((response: { data: Build }) => response.data)
  }
}
