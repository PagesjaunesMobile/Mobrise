// @flow

import querystring from 'querystring'

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
  next?: string,
  page_item_limit: number,
  total_item_count: number,
}

export type Response<T> = {
  paging: Paging,
  data: T,
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

  async request(path: string, params?: any): Promise<any> {
    const response = await fetch(`${this.url}/${path}?${params ? querystring.stringify(params) : ''}`, {
      headers: {
        Authorization: `token ${this.token}`,
      },
    })
    if (response.status !== 200) {
      throw new Error()
    }
    return response.json()
  }

  account(): Promise<Response<Account>> {
    return this.request('me')
  }

  apps(next?: string): Promise<Response<Array<App>>> {
    return this.request('me/apps', { next })
  }

  builds(app: string, next?: string): Promise<Response<Array<Build>>> {
    return this.request(`apps/${app}/builds`, { next })
  }

  build(app: string, build: string): Promise<Response<Build>> {
    return this.request(`apps/${app}/builds/${build}`)
  }
}
