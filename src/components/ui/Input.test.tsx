import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'  // Adjust the import path as needed

describe('Input Component', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders left icon when provided', () => {
    const LeftIcon = () => <span data-testid="left-icon">Left</span>
    render(<Input leftIcon={<LeftIcon />} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon when provided', () => {
    const RightIcon = () => <span data-testid="right-icon">Right</span>
    render(<Input rightIcon={<RightIcon />} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    render(<Input type="password" />)
    // const input = screen.getByRole('textbox') as HTMLInputElement
    const input = screen.getByTestId('password-input') as HTMLInputElement
    expect(input.type).toBe('password')

    const toggleButton = screen.getByRole('button')
    await userEvent.click(toggleButton)
    expect(input.type).toBe('text')

    await userEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('displays error message when hasError is true', () => {
    render(<Input hasError={true} errorMessage="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('does not display error message when hasError is false', () => {
    render(<Input hasError={false} errorMessage="Test error" />)
    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })

  it('calls onChange when input value changes', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    expect(handleChange).toHaveBeenCalledTimes(4)
  })

  it('applies containerClassName', () => {
    render(<Input containerClassName="container-class" />)
    expect(screen.getByRole('textbox').parentElement?.parentElement).toHaveClass('container-class')
  })
})