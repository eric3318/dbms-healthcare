import { useState } from 'react';
import { Container, Tabs, Title, TextInput, Stack, Button, Paper, Group, Text, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconUser, IconNotes } from '@tabler/icons-react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<string | null>('personal');

    return (
        <Container size="md" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Title order={2}>Profile Settings</Title>
                </Group>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
                            Personal Information
                        </Tabs.Tab>
                        <Tabs.Tab value="medical" leftSection={<IconNotes size={16} />}>
                            Medical History
                        </Tabs.Tab>
                    </Tabs.List>

                    <Paper withBorder p="xl" mt="md" radius="md">
                        <Tabs.Panel value="personal">
                            <Stack gap="md">
                                <DateInput label="Date of Birth" placeholder="Select your date of birth" clearable />
                                <TextInput label="Phone Number" placeholder="Your phone number" />
                                <Button>Save Changes</Button>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="medical">
                            <Stack gap="lg">
                                <div>
                                    <Text fw={500} mb="xs">
                                        Pre-existing Conditions
                                    </Text>
                                    <Textarea
                                        placeholder="List any chronic conditions, ongoing health issues, or significant past diagnoses"
                                        minRows={3}
                                    />
                                </div>

                                <div>
                                    <Text fw={500} mb="xs">
                                        Previous Surgeries
                                    </Text>
                                    <Textarea
                                        placeholder="List any surgeries with approximate dates (e.g., Appendectomy - 2019)"
                                        minRows={3}
                                    />
                                </div>

                                <div>
                                    <Text fw={500} mb="xs">
                                        Family History
                                    </Text>
                                    <Textarea
                                        placeholder="List significant medical conditions in your family (including parents and siblings)"
                                        minRows={4}
                                    />
                                </div>

                                <div>
                                    <Text fw={500} mb="xs">
                                        Current Medications
                                    </Text>
                                    <Textarea
                                        placeholder="List all current medications with dosage (e.g., Metformin 500mg twice daily)"
                                        minRows={2}
                                    />
                                </div>

                                <div>
                                    <Text fw={500} mb="xs">
                                        Allergies
                                    </Text>
                                    <Textarea
                                        placeholder="List any allergies to medications, foods, or other substances"
                                        minRows={2}
                                    />
                                </div>

                                <Button>Update Medical Information</Button>
                            </Stack>
                        </Tabs.Panel>
                    </Paper>
                </Tabs>
            </Stack>
        </Container>
    );
}
