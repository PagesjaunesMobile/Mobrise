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

  async request(path: string): Promise<any> {
    const response = await fetch(`${this.url}/${path}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    })
    if (response.status !== 200) {
      throw new Error()
    }
    return response.json().data
  }

  account(): Promise<Account> {
    return this.request('me')
  }

  apps(): Promise<Array<App>> {
    return this.request('me/apps')
  }

  builds(app: string): Promise<Array<Build>> {
    return this.request(`apps/${app}/builds`)
  }

  build(app: string, build: string): Promise<Build> {
    return this.request(`apps/${app}/builds/${build}`)
  }
}
