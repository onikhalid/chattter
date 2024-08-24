import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'  // Adjust the import path as needed

describe('Input Component', () => {
  it('renders an input element', () => {
    render(<Input name="test" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input name="test" className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders left icon when provided', () => {
    const LeftIcon = () => <span data-testid="left-icon">Left</span>
    render(<Input name="test" leftIcon={<LeftIcon />} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon when provided', () => {
    const RightIcon = () => <span data-testid="right-icon">Right</span>
    render(<Input name="test" rightIcon={<RightIcon />} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    render(<Input name='test' type="password" />)
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
    render(<Input name='test' hasError={true} errorMessage="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('does not display error message when hasError is false', () => {
    render(<Input name='test' hasError={false} errorMessage="Test error" />)
    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })

  it('calls onChange when input value changes', async () => {
    const handleChange = vi.fn()
    render(<Input name="test" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    expect(handleChange).toHaveBeenCalledTimes(4)
  })

  it('applies containerClassName', () => {
    render(<Input name="test" containerClassName="container-class" />)
    expect(screen.getByRole('textbox').parentElement?.parentElement).toHaveClass('container-class')
  })
})