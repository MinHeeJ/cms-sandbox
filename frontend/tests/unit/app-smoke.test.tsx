import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRouter } from '../../src/app/routes/AppRouter';
describe('AppRouter', () => { it('renders admin content shell', () => { render(<AppRouter/>); expect(screen.getByText('콘텐츠관리')).toBeInTheDocument(); }); });
