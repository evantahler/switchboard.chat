import React from 'react'
import Router from 'next/router'
import SessionRepository from './../../../repositories/session'
import UserRepository from './../../../repositories/user'
import SuccessRepository from './../../../repositories/success'
import ErrorRepository from './../../../repositories/error'
import ContactsRepository from './../../../repositories/contacts'
import ContactRepository from './../../../repositories/contact'
import FoldersRepository from './../../../repositories/folders'
import FolderRepository from './../../../repositories/folder'
import MessagesRepository from './../../../repositories/messages'
import MessageRepository from './../../../repositories/message'
import TeamRepository from './../../../repositories/team'
import TeamsRepository from './../../../repositories/teams'
import TeamMemberRepository from './../../../repositories/teamMember'
import TeamMembersRepository from './../../../repositories/teamMembers'

class SignOutForm extends React.Component {
  componentDidMount () {
    this.submit()
  }

  async submit (form) {
    await SessionRepository.destroy()
    await UserRepository.remove()
    await SuccessRepository.remove()
    await ErrorRepository.remove()
    await ContactsRepository.remove()
    await ContactRepository.remove()
    await MessagesRepository.remove()
    await MessageRepository.remove()
    await FoldersRepository.remove()
    await FolderRepository.remove()
    await TeamRepository.remove()
    await TeamsRepository.remove()
    await TeamMemberRepository.remove()
    await TeamMembersRepository.remove()
    Router.push('/')
  }

  render () {
    return null
  }
}

export default SignOutForm
