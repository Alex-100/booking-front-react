import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorCard } from './error-card'

interface ErrorBoundaryProps {
  children?: ReactNode
  // fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean
  error: string
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    console.log('E', error)
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log('EEEE', error, info, error.message)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorCard message={this.state.error} />
    }

    return this.props.children
  }
}
