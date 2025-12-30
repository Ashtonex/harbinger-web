"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Container, Table, Button, Badge, Group, Title, ActionIcon, Menu } from "@mantine/core";
import { IconDots, IconShield, IconBan } from "@tabler/icons-react";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
  };

  const updateUser = async (id: string, updates: any) => {
    await supabase.from("profiles").update(updates).eq("id", id);
    fetchUsers(); // Refresh list
  };

  return (
    <Container size="lg" py="xl">
      <Title mb="xl">Congregation Management</Title>
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((u) => (
            <Table.Tr key={u.id} bg={u.is_banned ? "red.0" : "transparent"}>
              <Table.Td>{u.email}</Table.Td>
              <Table.Td>
                <Badge color={u.role === 'admin' ? 'red' : u.role === 'pastor' ? 'blue' : 'gray'}>
                  {u.role}
                </Badge>
              </Table.Td>
              <Table.Td>{u.is_banned ? <Badge color="red">BANNED</Badge> : "Active"}</Table.Td>
              <Table.Td>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="subtle"><IconDots size={16}/></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Role</Menu.Label>
                    <Menu.Item leftSection={<IconShield size={14}/>} onClick={() => updateUser(u.id, { role: 'pastor' })}>
                      Make Pastor
                    </Menu.Item>
                    <Menu.Item leftSection={<IconShield size={14}/>} onClick={() => updateUser(u.id, { role: 'user' })}>
                      Demote to User
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Moderation</Menu.Label>
                    <Menu.Item 
                      color={u.is_banned ? "green" : "red"} 
                      leftSection={<IconBan size={14}/>}
                      onClick={() => updateUser(u.id, { is_banned: !u.is_banned })}
                    >
                      {u.is_banned ? "Unban User" : "Ban User"}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}