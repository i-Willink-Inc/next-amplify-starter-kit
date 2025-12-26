import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the AWS SES client
vi.mock('@aws-sdk/client-ses', () => ({
    SESClient: vi.fn().mockImplementation(function() {
        return { send: vi.fn() };
    }),
    SendEmailCommand: vi.fn(),
}));

describe('SES Client', () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.AWS_REGION = 'ap-northeast-1';
        process.env.SES_FROM_EMAIL = 'test@example.com';
        process.env.SES_TO_EMAIL = 'recipient@example.com';
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getDefaultToEmail', () => {
        it('should return SES_TO_EMAIL when set', async () => {
            const { getDefaultToEmail } = await import('@/lib/ses-client');
            expect(getDefaultToEmail()).toBe('recipient@example.com');
        });

        it('should return undefined when SES_TO_EMAIL is not set', async () => {
            delete process.env.SES_TO_EMAIL;
            vi.resetModules();
            
            const { getDefaultToEmail } = await import('@/lib/ses-client');
            expect(getDefaultToEmail()).toBeUndefined();
        });
    });

    describe('sendEmail', () => {
        it('should send email successfully', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'test-message-id',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: 'recipient@example.com',
                subject: 'Test Subject',
                body: 'Test Body',
            });

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });

        it('should handle array of recipients', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'test-message-id-2',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: ['recipient1@example.com', 'recipient2@example.com'],
                subject: 'Test Subject',
                body: 'Test Body',
            });

            expect(result.success).toBe(true);
        });

        it('should return error on failure', async () => {
            const mockSend = vi.fn().mockRejectedValue(new Error('SES Error'));

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: 'recipient@example.com',
                subject: 'Test Subject',
                body: 'Test Body',
            });

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should return error when SES_FROM_EMAIL is not set', async () => {
            delete process.env.SES_FROM_EMAIL;

            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'test-message-id',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: 'recipient@example.com',
                subject: 'Test Subject',
                body: 'Test Body',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('SES_FROM_EMAIL');
        });
        it('should handle cc, bcc and replyTo', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'test-message-id',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            await sendEmail({
                to: 'to@example.com',
                subject: 'Test',
                body: 'Body',
                cc: 'cc@example.com',
                bcc: ['bcc1@example.com', 'bcc2@example.com'],
                replyTo: 'reply@example.com',
            });

            const { SendEmailCommand } = await import('@aws-sdk/client-ses');
            expect(SendEmailCommand).toHaveBeenCalledWith(expect.objectContaining({
                Destination: {
                    ToAddresses: ['to@example.com'],
                    CcAddresses: ['cc@example.com'],
                    BccAddresses: ['bcc1@example.com', 'bcc2@example.com'],
                },
                ReplyToAddresses: ['reply@example.com'],
            }));
        });

        it('should handle MessageRejected error', async () => {
            const error = new Error('Message Rejected');
            error.name = 'MessageRejected';
            const mockSend = vi.fn().mockRejectedValue(error);

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: 'recipient@example.com',
                subject: 'Test',
                body: 'Body',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Email was rejected');
        });

        it('should handle MailFromDomainNotVerifiedException', async () => {
            const error = new Error('Domain not verified');
            error.name = 'MailFromDomainNotVerifiedException';
            const mockSend = vi.fn().mockRejectedValue(error);

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendEmail } = await import('@/lib/ses-client');

            const result = await sendEmail({
                to: 'recipient@example.com',
                subject: 'Test',
                body: 'Body',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('sender domain is not verified');
        });
    });

    describe('HTML Escaping', () => {
        it('should escape HTML characters in contact email', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'id',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendContactEmail } = await import('@/lib/ses-client');

            await sendContactEmail({
                name: '<b>Bold</b>',
                email: 'test@example.com',
                message: '<script>alert("xss")</script>',
            });

            const { SendEmailCommand } = await import('@aws-sdk/client-ses');
            const callArgs = vi.mocked(SendEmailCommand).mock.calls[0][0];
            const htmlBody = callArgs.Message?.Body?.Html?.Data || '';

            expect(htmlBody).toContain('&lt;b&gt;Bold&lt;/b&gt;');
            expect(htmlBody).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
        });
    });

    describe('sendContactEmail', () => {
        it('should format and send contact email', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'contact-message-id',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendContactEmail } = await import('@/lib/ses-client');

            const result = await sendContactEmail({
                name: 'Test User',
                email: 'user@example.com',
                subject: 'Test Inquiry',
                message: 'This is a test message',
            });

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('contact-message-id');
        });

        it('should use default subject when not provided', async () => {
            const mockSend = vi.fn().mockResolvedValue({
                MessageId: 'contact-message-id-2',
            });

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendContactEmail } = await import('@/lib/ses-client');

            const result = await sendContactEmail({
                name: 'Test User',
                email: 'user@example.com',
                message: 'This is a test message without subject',
            });

            expect(result.success).toBe(true);
        });

        it('should return error when no recipient is configured', async () => {
            delete process.env.SES_TO_EMAIL;

            const mockSend = vi.fn(); // Mock send needed even if not called due to earlier checks, or use default mock

            vi.doMock('@aws-sdk/client-ses', () => ({
                SESClient: vi.fn().mockImplementation(function() {
                    return { send: mockSend };
                }),
                SendEmailCommand: vi.fn(),
            }));

            vi.resetModules();
            const { sendContactEmail } = await import('@/lib/ses-client');

            const result = await sendContactEmail({
                name: 'Test User',
                email: 'user@example.com',
                message: 'This is a test message',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('No recipient specified');
        });
    });
});
